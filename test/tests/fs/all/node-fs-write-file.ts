import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  if (!fs.getRootFS().isReadOnly()) {
    var join = path.join;

    var filename = join(common.tmpDir, 'test.txt');

    var s = '南越国是前203年至前111年存在于岭南地区的一个国家，国都位于番禺，疆域包括今天中国的广东、' +
            '广西两省区的大部份地区，福建省、湖南、贵州、云南的一小部份地区和越南的北部。' +
            '南越国是秦朝灭亡后，由南海郡尉赵佗于前203年起兵兼并桂林郡和象郡后建立。' +
            '前196年和前179年，南越国曾先后两次名义上臣属于西汉，成为西汉的“外臣”。前112年，' +
            '南越国末代君主赵建德与西汉发生战争，被汉武帝于前111年所灭。南越国共存在93年，' +
            '历经五代君主。南越国是岭南地区的第一个有记载的政权国家，采用封建制和郡县制并存的制度，' +
            '它的建立保证了秦末乱世岭南地区社会秩序的稳定，有效的改善了岭南地区落后的政治、##济现状。\n';

    var ncallbacks = 0;

    fs.writeFile(filename, s, function(e) {
      if (e) throw e;
      ncallbacks++;
      fs.readFile(filename, function(e, buffer) {
        if (e) throw e;
        ncallbacks++;
        var expected = Buffer.byteLength(s);
        assert.equal(expected, buffer.length,
            'Buffer length mismatch for ' + filename + ': expected ' + expected +
            ', got ' + buffer.length);
      });
    });

    // test that writeFile accepts buffers
    var filename2 = join(common.tmpDir, 'test2.txt');
    var buf = new Buffer(s, 'utf8');

    fs.writeFile(filename2, buf, function(e) {
      if (e) throw e;
      ncallbacks++;
      fs.readFile(filename2, function(e, buffer) {
        if (e) throw e;
        ncallbacks++;
        assert.equal(buf.length, buffer.length,
            'Buffer length mismatch for ' + filename2 + ': expected ' +
            buf.length + ', got ' + buffer.length);
      });
    });

    // BFS: We don't support writing a single byte to the file.
    /*
    // test that writeFile accepts numbers.
    var filename3 = join(common.tmpDir, 'test3.txt');
    var m = 0600;
    fs.writeFile(filename3, n, { mode: m }, function(e) {
      if (e) throw e;

      // windows permissions aren't unix
      if (process.platform !== 'win32') {
        fs.stat(filename3,function(err, st) {
          if (err) throw err;
          assert.equal(st.mode & 0700, m);
        });
      }

      ncallbacks++;
      common.error('file3 written');

      fs.readFile(filename3, function(e, buffer) {
        if (e) throw e;
        common.error('file3 read');
        ncallbacks++;
        assert.equal(Buffer.byteLength('' + n), buffer.length);
      });
    });*/


    process.on('exit', function() {
      // BFS: 6=>4, since I commented out one part of the test.
      assert.equal(4, ncallbacks, 'Expected 4 callbacks, got ' + ncallbacks);

      fs.unlink(filename, function(err) { if (err) throw err; });
      fs.unlink(filename2, function(err) { if (err) throw err; });
      //fs.unlink(filename3, function(err) { if (err) throw err; });
    });
  }
};
